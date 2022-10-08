varying highp vec4 vColor;
varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;

void main(void) {
    gl_FragColor = mix(
      texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)),
      vColor, 0.5
    );
}