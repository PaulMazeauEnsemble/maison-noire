vec3 getGradientColor(vec2 point, vec2 gradientCenter, vec2 gradientSize, vec3 color1, vec3 color2, vec3 color3) {
    float dist = distance(point, gradientCenter) / max(gradientSize.x, gradientSize.y);
    
    // Interpolate between the three colors based on distance.
    if (dist <= ) {
        return mix(color1.rgb, color2.rgb, dist * 3.0);
    } else if (dist <= 0.667) {
        return mix(color2.rgb, color3.rgb, (dist - 0.333) * 3.0);
    } else {
        return color3.rgb;
    }
}