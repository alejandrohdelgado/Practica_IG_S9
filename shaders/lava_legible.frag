precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    // Coordenadas normalizadas del píxel y del ratón en el rango [0, 1]
    vec2 res = u_resolution;
    vec2 uv = gl_FragCoord.xy / res;
    vec2 mouse = u_mouse / res;

    // Desvanecimiento automático en los bordes para que el efecto se apague
    // cuando el ratón sale del lienzo o aún no se ha movido (0, 0)
    vec2 borderDist = min(mouse, 1.0 - mouse);
    float mouseActive = smoothstep(0.02, 0.1, min(borderDist.x, borderDist.y));

    // Corrección de relación de aspecto para evitar deformaciones
    float aspect = res.x / res.y;
    uv.x *= aspect;
    mouse.x *= aspect;

    // Escalado del espacio y vector desde el cursor hasta el píxel actual
    vec2 p = uv * 4.0;
    vec2 dir = uv - mouse;

    // Influencia radial gaussiana alrededor del puntero
    float heat = exp(-dot(dir, dir) * 15.0) * mouseActive;

    // Empuje suave del fluido hacia fuera al pasar el ratón por encima
    p -= (dir / (length(dir) + 0.01)) * heat * 0.4;

    // Distorsión iterativa (domain warping trigonométrico) para simular lava fluida
    for (int i = 1; i < 5; i++) {
        float freq = float(i);
        p += vec2(sin(p.y * freq + u_time), cos(p.x * freq - u_time)) / freq;
    }

    // Intensidad final de la lava reforzada con el calor local del cursor
    float lava = sin(p.x + p.y) * 0.5 + 0.5 + heat * 0.4;

    // Mapeo a paleta incandescente (oscuro -> rojo -> naranja -> amarillo)
    vec3 color = vec3(
        smoothstep(0.2, 0.8, lava),
        smoothstep(0.5, 1.0, lava) * 0.5,
        smoothstep(0.8, 1.2, lava) * 0.2
    );

    gl_FragColor = vec4(color, 1.0);
}
