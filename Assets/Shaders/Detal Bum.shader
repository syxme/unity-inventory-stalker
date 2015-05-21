Shader "Syxme/Bumped Specular Detail Parallax map" {
Properties {
	_Color ("Main Color", Color) = (1,1,1,1)
	_SpecColor ("Specular Color", Color) = (0.5, 0.5, 0.5, 1)
	_Shininess ("Shininess", Range (0.03, 1)) = 0.078125
	_DetailRange ("Detail Intensity", Range (0.8, 5)) = 2
	_HeightmapStrength ("Heightmap Strength", Range (-100, 100)) = 10
	_MainTex ("Base (RGB) Gloss (A)", 2D) = "white" {}
	_DetailMap ("Detail (RGB)", 2D) = "gray" {}
	_BumpMap ("Normalmap", 2D) = "bump" {}
	_SpecMap ("Specular map", 2D) = "black" {}
	_HeightMap ("Heightmap (R)", 2D) = "grey" {}
	_HeightmapStrength ("Heightmap Strength", Float) = 1.0
}
SubShader { 
	Tags { "RenderType"="Opaque" }
	LOD 400
	
CGPROGRAM
//#pragma surface surf NormalsHeight
#pragma surface surf BlinnPhong
#pragma target 3.0

sampler2D _MainTex;
sampler2D _BumpMap;
sampler2D _SpecMap;
sampler2D _DetailMap;
sampler2D _HeightMap;
fixed4 _Color;
half _Shininess;
half _DetailRange;

struct Input {
	float2 uv_MainTex;
	float2 uv_BumpMap;
	float2 uv_SpecMap;
	float2 uv_DetailMap;
};
float _HeightmapStrength;
void surf (Input IN, inout SurfaceOutput o) {
	
	
	float3 normal = UnpackNormal(tex2D(_BumpMap, IN.uv_BumpMap));
	float me = tex2D(_HeightMap,IN.uv_MainTex).x;
	float n = tex2D(_HeightMap,float2(IN.uv_MainTex.x,IN.uv_MainTex.y+1.0/2048)).x;
	float s = tex2D(_HeightMap,float2(IN.uv_MainTex.x,IN.uv_MainTex.y-1.0/2048)).x;
	float e = tex2D(_HeightMap,float2(IN.uv_MainTex.x-1.0/2048,IN.uv_MainTex.y)).x;
	float w = tex2D(_HeightMap,float2(IN.uv_MainTex.x+1.0/2048,IN.uv_MainTex.y)).x;
	
	float3 norm = normal;
	float3 temp = norm; //a temporary vector that is not parallel to norm
	if(norm.x==1)
		temp.y+=0.5;
	else
		temp.x+=0.5;
		
	float3 perp1 = normalize(cross(norm,temp));
	float3 perp2 = normalize(cross(norm,perp1));
	
	float3 normalOffset = -_HeightmapStrength * ( ( (n-me) - (s-me) ) * perp1 + ( ( e - me ) - ( w - me ) ) * perp2 );
	norm += normalOffset;
	norm = normalize(norm);
	
	fixed4 tex = tex2D(_MainTex, IN.uv_MainTex)* _Color;
	fixed4 specTex = tex2D(_SpecMap, IN.uv_SpecMap);
	tex.rgb *= tex2D(_DetailMap,IN.uv_DetailMap).rgb*_DetailRange;
	o.Albedo = tex.rgb;
	o.Gloss = specTex.r;
	o.Alpha = tex.a * _Color.a;
	o.Specular = _Shininess * specTex.g;
	o.Normal = norm;
}
inline fixed4 LightingNormalsHeight (SurfaceOutput s, fixed3 lightDir, fixed3 viewDir, fixed atten)
			{
				viewDir = normalize(viewDir);
				lightDir = normalize(lightDir);
				s.Normal = normalize(s.Normal);
				float NdotL = dot(s.Normal, lightDir);
				_LightColor0.rgb = _LightColor0.rgb;

				fixed4 c;
				c.rgb = float3(0.5) * saturate ( NdotL ) * _LightColor0.rgb * atten;
				c.a = 1.0;
				return c;
			}
ENDCG
}

FallBack "VertexLit"
}