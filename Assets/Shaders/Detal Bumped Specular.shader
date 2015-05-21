Shader "Syxme/Bumped Specular Detail map" {
Properties {
	_Color ("Main Color", Color) = (1,1,1,1)
	_SpecColor ("Specular Color", Color) = (0.5, 0.5, 0.5, 1)
	_Shininess ("Shininess", Range (0.03, 1)) = 0.078125
	_DetailRange ("Detail Intensity", Range (0.8, 5)) = 2
	_Parallax ("Height", Range (0.005, 0.08)) = 0.02
	_MainTex ("Base (RGB) Gloss (A)", 2D) = "white" {}
	_DetailMap ("Detail (RGB)", 2D) = "gray" {}
	_BumpMap ("Normalmap", 2D) = "bump" {}
	_SpecMap ("Specular map", 2D) = "black" {}
	_ParallaxMap ("Heightmap (A)", 2D) = "black" {}
}
SubShader { 
	Tags { "RenderType"="Opaque" }
	LOD 400
	
CGPROGRAM
#pragma surface surf BlinnPhong
#pragma target 3.0

sampler2D _MainTex;
sampler2D _BumpMap;
sampler2D _SpecMap;
sampler2D _DetailMap;
sampler2D _ParallaxMap;
fixed4 _Color;
half _Shininess;
half _DetailRange;
float _Parallax;

struct Input {
	float2 uv_MainTex;
	float2 uv_BumpMap;
	float2 uv_SpecMap;
	float2 uv_DetailMap;
	float3 viewDir;
};

void surf (Input IN, inout SurfaceOutput o) {
	half h = tex2D (_ParallaxMap, IN.uv_BumpMap).w;
	float2 offset = ParallaxOffset (h, _Parallax, IN.viewDir);
	IN.uv_MainTex += offset;
	IN.uv_BumpMap += offset;
	IN.uv_DetailMap += offset;
	IN.uv_SpecMap += offset;


	fixed4 tex = tex2D(_MainTex, IN.uv_MainTex)* _Color;
	fixed4 specTex = tex2D(_SpecMap, IN.uv_SpecMap);
	tex.rgb *= tex2D(_DetailMap,IN.uv_DetailMap).rgb*_DetailRange;
	o.Albedo = tex.rgb;
	o.Gloss = specTex.r;
	o.Alpha = tex.a * _Color.a;
	o.Specular = _Shininess * specTex.g;
	o.Normal = UnpackNormal(tex2D(_BumpMap, IN.uv_BumpMap));
}
ENDCG
}

FallBack "Specular"
}