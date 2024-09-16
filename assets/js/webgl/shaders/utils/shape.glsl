float draw_circle(vec2 pos, float radius, vec2 uv){
  float d = length(pos - uv.xy) - radius;
	float t = clamp(d, 0.0, 1.0);
  return 1.0 - t;
}

float draw_rect(vec2 pos, float width, float height, vec2 space, vec2 uv){
  float paint_x = step(pos.x, uv.x) * (1.0 - step(pos.x + width, uv.x));
  float paint_y = step(pos.y, space.y - uv.y) * (1.0 - step(pos.y + height, space.y - uv.y));
  return paint_y * paint_x;
}

float draw_shape(vec2 pos, float width, float height, vec2 space, vec2 uv){

  float radius = width * 0.5;

  float paint_rect = draw_rect(
    vec2(pos.x - radius, space.y - height - pos.y + height * 0.75), 
    width, height,
    space, uv
  );
  float paint_circle = draw_circle(vec2(pos.x + radius - radius, pos.y + height - height * 0.75), radius, uv);

  return min(paint_circle + paint_rect, 1.0);
}