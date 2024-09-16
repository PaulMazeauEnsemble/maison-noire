uniform sampler2D uCurrent;
uniform bool uCurrentHTML;
uniform sampler2D uNext;
uniform bool uNextHTML;
uniform vec2 uResolution;
uniform float uProgress;
uniform float uMenuProgress;
uniform float uStartProgress;
uniform float uStart1;
uniform float uStart2;
uniform float uStart3;
uniform float uDpr;

varying vec2 vUv;

#define PI 3.14
const highp float NOISE_GRANULARITY = 0.5/255.0;

#include /utils/map.glsl;
#include /utils/shape.glsl;

// Helpers

vec2 scale_uv(vec2 uv, float scale){
     return uv = (uv - 0.5) * (1. / scale) + 0.5;
}

float circularOut(float t) {
  return sqrt((2.0 - t) * t);
}

highp float random(highp vec2 coords) {
   return fract(sin(dot(coords.xy, vec2(12.9898,78.233))) * 43758.5453);
}

// handlers
vec4 handle_quads(){

  vec4 output_quad = vec4(1.0);

  float progress = uProgress;

  float menu_scale = (1.0 - uMenuProgress * 0.3);
  float start_scale = 0.4 * circularOut(uStartProgress) + 0.6;

  vec4 current = texture2D(uCurrent, scale_uv(vUv, start_scale * menu_scale));
  vec4 next = texture2D(uNext, scale_uv(vUv, start_scale * menu_scale));


  // size
  float size_max = max(uResolution.x, uResolution.y) * 1.2;
  float shape_size = progress * size_max * menu_scale;

  float paint_shape = draw_shape(
    vec2(uResolution.x * 0.5, uResolution.y * 0.5),
    shape_size,
    shape_size,
    uResolution, gl_FragCoord.xy
  );

  output_quad = current;
  
  if(0.0 < paint_shape && progress > 0.0){
    if(uNextHTML){
      output_quad = vec4(vec3(0.0), 1.0 - progress);
      output_quad.a *= (1.0 + uMenuProgress * ((1.0/(1.0-progress))-1.0));
    } else {
      output_quad = mix(vec4(1.0), next, circularOut(progress));
    }
  }

  return output_quad;
}


#define MENU_LIGHT vec3(0.78)
#define MENU_DARK vec3(0.463)

vec4 handle_menu(){
  vec4 output_menu = gl_FragColor;

  float size_max = max(uResolution.x, uResolution.y) * 1.1;
  #ifdef IS_MOBILE
    float size_min = uResolution.x * 0.26;
  #else
    float size_min = uResolution.x * 0.14;
  #endif
  
  float shape_size = map(uMenuProgress, 0.0, 1.0, size_max, size_min);

  float paint_shape = draw_shape(
    vec2(uResolution.x * 0.5, uResolution.y * 0.5),
    shape_size,
    shape_size,
    uResolution, gl_FragCoord.xy
  );

  if(paint_shape < 1.0){

    float gradient_length = 1.2 * (sqrt(2.0) / 2.0);
    float gradient_dist = distance(vec2(0.5), vUv);
    gradient_dist /= gradient_length;
    gradient_dist += (uMenuProgress - 1.0) * -1.5;

    // vec3 gradient = vec3(gradient_dist);
    vec3 gradient = mix(MENU_LIGHT, MENU_DARK, gradient_dist);
    
    output_menu.rgb = gradient;
      if(uCurrentHTML){
        output_menu.a = 1.0;
      }
  } else {
    output_menu.rgb *= 1.0 - uMenuProgress;
    if(uCurrentHTML){
      output_menu.a = uMenuProgress;
    }
  }
  
  return output_menu;
}

float draw_my_shape(float interpolation){

  float size_max = max(uResolution.x, uResolution.y) * 1.2;

  float shape_size = map(interpolation, 0.0, 1.0, 0.0, size_max);
  float paint_shape = draw_shape(
    vec2(uResolution.x * 0.5, uResolution.y * 0.5),
    shape_size,
    shape_size,
    uResolution, gl_FragCoord.xy
  );

  return paint_shape;
}

// Main

vec3 gradient_2(vec3 color_start, vec3 color_end, float interpolation){
  return mix(color_start, color_end, interpolation);
}


#define pipeline_overlay_threshold 1e-6
vec3 pipeline_overlay(vec3 base, vec3 overlay){
  float overlay_intensity = overlay.r + overlay.g + overlay.g;
  float paint = step(pipeline_overlay_threshold, overlay_intensity);
  return paint * overlay + (1.0 - paint) * base;
}


#define BLACK vec3(0.0)
#define GRAD_DARK_COLOR_1 vec3(0.06)
#define GRAD_LIGHT_COLOR_1 vec3(0.15)

vec4 handle_start(){

  vec4 output_color = vec4(vec3(0.0), 1.0);
  vec2 st = gl_FragCoord.xy / uResolution;

  // gradients
  vec3 gradient_light = gradient_2(BLACK, GRAD_LIGHT_COLOR_1, st.y);
  vec3 gradient_dark = gradient_2(GRAD_DARK_COLOR_1, BLACK, st.y);

  // assemble gradients
  vec3 grad_color = BLACK;
  grad_color += gradient_dark * draw_my_shape(uStart1);
  grad_color = pipeline_overlay(
    grad_color,
    gradient_light * draw_my_shape(uStart2)
  );
  grad_color = pipeline_overlay(
    grad_color,
    gradient_dark * draw_my_shape(uStart3)
  );

  // dithering
  grad_color += mix(-NOISE_GRANULARITY, NOISE_GRANULARITY, random(st));


  output_color.rgb = grad_color;

  output_color = mix(output_color, gl_FragColor, draw_my_shape(uStartProgress));

  return output_color;
}

void main() {
  gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);

  gl_FragColor = handle_quads();
  gl_FragColor = handle_menu();
  gl_FragColor = handle_start();
}