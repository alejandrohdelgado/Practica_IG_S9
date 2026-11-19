precision mediump float;
uniform vec2 u_resolution,u_mouse;
uniform float u_time;
void main(){vec2 r=u_resolution,u=gl_FragCoord.xy/r,m=u_mouse/r,b=min(m,1.-m);float k=smoothstep(.02,.1,min(b.x,b.y));u.x*=r.x/r.y;m.x*=r.x/r.y;vec2 p=u*4.,d=u-m;float e=exp(-dot(d,d)*15.)*k;p-=d/(length(d)+.01)*e*.4;for(int i=1;i<5;i++){float f=float(i);p+=vec2(sin(p.y*f+u_time),cos(p.x*f-u_time))/f;}float v=sin(p.x+p.y)*.5+.5+e*.4;gl_FragColor=vec4(smoothstep(.2,.8,v),smoothstep(.5,1.,v)*.5,smoothstep(.8,1.2,v)*.2,1.);}
