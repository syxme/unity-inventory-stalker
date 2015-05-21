// Shader created with Shader Forge Beta 0.25 
// Shader Forge (c) Joachim Holmer - http://www.acegikmo.com/shaderforge/
// Note: Manually altering this data may prevent you from opening it in Shader Forge
/*SF_DATA;ver:0.25;sub:START;pass:START;ps:flbk:,lico:1,lgpr:1,nrmq:1,limd:0,uamb:True,mssp:True,lmpd:False,lprd:False,enco:False,frtr:True,vitr:True,dbil:False,rmgx:True,hqsc:True,hqlp:False,blpr:0,bsrc:0,bdst:0,culm:0,dpts:2,wrdp:True,ufog:True,aust:True,igpj:False,qofs:0,qpre:1,rntp:1,fgom:False,fgoc:False,fgod:False,fgor:False,fgmd:0,fgcr:0.5,fgcg:0.5,fgcb:0.5,fgca:1,fgde:0.01,fgrn:0,fgrf:300,ofsf:0,ofsu:0;n:type:ShaderForge.SFN_Final,id:1,x:32228,y:32480|normal-442-OUT,custl-4-OUT;n:type:ShaderForge.SFN_LightAttenuation,id:2,x:33039,y:32945;n:type:ShaderForge.SFN_LightColor,id:3,x:33039,y:32793;n:type:ShaderForge.SFN_Multiply,id:4,x:32479,y:32687|A-711-OUT,B-122-OUT;n:type:ShaderForge.SFN_NormalVector,id:5,x:33786,y:32388,pt:True;n:type:ShaderForge.SFN_LightVector,id:6,x:33786,y:32267;n:type:ShaderForge.SFN_Dot,id:7,x:33597,y:32305,dt:1|A-6-OUT,B-5-OUT;n:type:ShaderForge.SFN_Multiply,id:9,x:33247,y:32338|A-63-RGB,B-7-OUT;n:type:ShaderForge.SFN_Tex2d,id:17,x:32988,y:31853,ptlb:BumpMap,tex:b5b492e53874e4c4da36179ce0e440de,ntxv:3,isnm:True;n:type:ShaderForge.SFN_HalfVector,id:28,x:33786,y:32539;n:type:ShaderForge.SFN_Dot,id:29,x:33597,y:32461,dt:1|A-5-OUT,B-28-OUT;n:type:ShaderForge.SFN_Power,id:37,x:33372,y:32491|VAL-29-OUT,EXP-45-OUT;n:type:ShaderForge.SFN_Add,id:39,x:32853,y:32548|A-9-OUT,B-605-OUT;n:type:ShaderForge.SFN_Slider,id:45,x:33612,y:32736,ptlb:Gloss,min:1,cur:45.90659,max:60;n:type:ShaderForge.SFN_Multiply,id:51,x:33201,y:32560|A-37-OUT,B-158-RGB;n:type:ShaderForge.SFN_Tex2d,id:63,x:33740,y:32053,ptlb:MainTex,tex:78fb70c64a6aa194380cdb4b0b2043ec,ntxv:0,isnm:False;n:type:ShaderForge.SFN_Multiply,id:122,x:32754,y:32862|A-3-RGB,B-2-OUT;n:type:ShaderForge.SFN_Tex2d,id:158,x:33400,y:32737,ptlb:SpecMap,tex:8fa8f77455c014d49b6b9f2b0e8aeb37,ntxv:0,isnm:False;n:type:ShaderForge.SFN_Sin,id:368,x:32710,y:31990|IN-17-RGB;n:type:ShaderForge.SFN_Tan,id:442,x:32495,y:32191|IN-368-OUT;n:type:ShaderForge.SFN_Slider,id:598,x:33289,y:32940,ptlb:Shinesses,min:1,cur:1,max:30;n:type:ShaderForge.SFN_Power,id:605,x:33019,y:32623|VAL-51-OUT,EXP-598-OUT;n:type:ShaderForge.SFN_Sqrt,id:639,x:33238,y:31975|IN-63-RGB;n:type:ShaderForge.SFN_Multiply,id:640,x:33327,y:32152|A-63-R,B-63-G,C-63-B;n:type:ShaderForge.SFN_Add,id:641,x:33009,y:32032|A-639-OUT,B-640-OUT;n:type:ShaderForge.SFN_Lerp,id:711,x:32775,y:32344|A-640-OUT,B-39-OUT,T-641-OUT;proporder:598-45-63-17-158;pass:END;sub:END;*/

Shader "FPS Game/Diffuse Bump Specular" {
    Properties {
        _Shinesses ("Shinesses", Range(1, 30)) = 1
        _Gloss ("Gloss", Range(1, 60)) = 45.90659
        _MainTex ("MainTex", 2D) = "white" {}
        _BumpMap ("BumpMap", 2D) = "bump" {}
        _SpecMap ("SpecMap", 2D) = "white" {}
    }
    SubShader {
        Tags {
            "RenderType"="Opaque"
        }
        Pass {
            Name "ForwardBase"
            Tags {
                "LightMode"="ForwardBase"
            }
            
            
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #define UNITY_PASS_FORWARDBASE
            #include "UnityCG.cginc"
            #include "AutoLight.cginc"
            #pragma multi_compile_fwdbase_fullshadows
            #pragma exclude_renderers xbox360 ps3 flash 
            #pragma target 3.0
            uniform float4 _LightColor0;
            uniform sampler2D _BumpMap; uniform float4 _BumpMap_ST;
            uniform float _Gloss;
            uniform sampler2D _MainTex; uniform float4 _MainTex_ST;
            uniform sampler2D _SpecMap; uniform float4 _SpecMap_ST;
            uniform float _Shinesses;
            struct VertexInput {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
                float4 tangent : TANGENT;
                float4 uv0 : TEXCOORD0;
            };
            struct VertexOutput {
                float4 pos : SV_POSITION;
                float4 uv0 : TEXCOORD0;
                float4 posWorld : TEXCOORD1;
                float3 normalDir : TEXCOORD2;
                float3 tangentDir : TEXCOORD3;
                float3 binormalDir : TEXCOORD4;
                LIGHTING_COORDS(5,6)
            };
            VertexOutput vert (VertexInput v) {
                VertexOutput o;
                o.uv0 = v.uv0;
                o.normalDir = mul(float4(v.normal,0), _World2Object).xyz;
                o.tangentDir = normalize( mul( _Object2World, float4( v.tangent.xyz, 0.0 ) ).xyz );
                o.binormalDir = normalize(cross(o.normalDir, o.tangentDir) * v.tangent.w);
                o.posWorld = mul(_Object2World, v.vertex);
                o.pos = mul(UNITY_MATRIX_MVP, v.vertex);
                TRANSFER_VERTEX_TO_FRAGMENT(o)
                return o;
            }
            fixed4 frag(VertexOutput i) : COLOR {
                i.normalDir = normalize(i.normalDir);
                float3x3 tangentTransform = float3x3( i.tangentDir, i.binormalDir, i.normalDir);
                float3 viewDirection = normalize(_WorldSpaceCameraPos.xyz - i.posWorld.xyz);
/////// Normals:
                float2 node_720 = i.uv0;
                float3 normalLocal = tan(sin(UnpackNormal(tex2D(_BumpMap,TRANSFORM_TEX(node_720.rg, _BumpMap))).rgb));
                float3 normalDirection =  normalize(mul( normalLocal, tangentTransform )); // Perturbed normals
                float3 lightDirection = normalize(_WorldSpaceLightPos0.xyz);
                float3 halfDirection = normalize(viewDirection+lightDirection);
////// Lighting:
                float attenuation = LIGHT_ATTENUATION(i);
                float4 node_63 = tex2D(_MainTex,TRANSFORM_TEX(node_720.rg, _MainTex));
                float node_640 = (node_63.r*node_63.g*node_63.b);
                float3 node_5 = normalDirection;
                float3 finalColor = (lerp(float3(node_640,node_640,node_640),((node_63.rgb*max(0,dot(lightDirection,node_5)))+pow((pow(max(0,dot(node_5,halfDirection)),_Gloss)*tex2D(_SpecMap,TRANSFORM_TEX(node_720.rg, _SpecMap)).rgb),_Shinesses)),(sqrt(node_63.rgb)+node_640))*(_LightColor0.rgb*attenuation));
/// Final Color:
                return fixed4(finalColor,1);
            }
            ENDCG
        }
        Pass {
            Name "ForwardAdd"
            Tags {
                "LightMode"="ForwardAdd"
            }
            Blend One One
            
            
            Fog { Color (0,0,0,0) }
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #define UNITY_PASS_FORWARDADD
            #include "UnityCG.cginc"
            #include "AutoLight.cginc"
            #pragma multi_compile_fwdadd_fullshadows
            #pragma exclude_renderers xbox360 ps3 flash 
            #pragma target 3.0
            uniform float4 _LightColor0;
            uniform sampler2D _BumpMap; uniform float4 _BumpMap_ST;
            uniform float _Gloss;
            uniform sampler2D _MainTex; uniform float4 _MainTex_ST;
            uniform sampler2D _SpecMap; uniform float4 _SpecMap_ST;
            uniform float _Shinesses;
            struct VertexInput {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
                float4 tangent : TANGENT;
                float4 uv0 : TEXCOORD0;
            };
            struct VertexOutput {
                float4 pos : SV_POSITION;
                float4 uv0 : TEXCOORD0;
                float4 posWorld : TEXCOORD1;
                float3 normalDir : TEXCOORD2;
                float3 tangentDir : TEXCOORD3;
                float3 binormalDir : TEXCOORD4;
                LIGHTING_COORDS(5,6)
            };
            VertexOutput vert (VertexInput v) {
                VertexOutput o;
                o.uv0 = v.uv0;
                o.normalDir = mul(float4(v.normal,0), _World2Object).xyz;
                o.tangentDir = normalize( mul( _Object2World, float4( v.tangent.xyz, 0.0 ) ).xyz );
                o.binormalDir = normalize(cross(o.normalDir, o.tangentDir) * v.tangent.w);
                o.posWorld = mul(_Object2World, v.vertex);
                o.pos = mul(UNITY_MATRIX_MVP, v.vertex);
                TRANSFER_VERTEX_TO_FRAGMENT(o)
                return o;
            }
            fixed4 frag(VertexOutput i) : COLOR {
                i.normalDir = normalize(i.normalDir);
                float3x3 tangentTransform = float3x3( i.tangentDir, i.binormalDir, i.normalDir);
                float3 viewDirection = normalize(_WorldSpaceCameraPos.xyz - i.posWorld.xyz);
/////// Normals:
                float2 node_721 = i.uv0;
                float3 normalLocal = tan(sin(UnpackNormal(tex2D(_BumpMap,TRANSFORM_TEX(node_721.rg, _BumpMap))).rgb));
                float3 normalDirection =  normalize(mul( normalLocal, tangentTransform )); // Perturbed normals
                float3 lightDirection = normalize(lerp(_WorldSpaceLightPos0.xyz, _WorldSpaceLightPos0.xyz - i.posWorld.xyz,_WorldSpaceLightPos0.w));
                float3 halfDirection = normalize(viewDirection+lightDirection);
////// Lighting:
                float attenuation = LIGHT_ATTENUATION(i);
                float4 node_63 = tex2D(_MainTex,TRANSFORM_TEX(node_721.rg, _MainTex));
                float node_640 = (node_63.r*node_63.g*node_63.b);
                float3 node_5 = normalDirection;
                float3 finalColor = (lerp(float3(node_640,node_640,node_640),((node_63.rgb*max(0,dot(lightDirection,node_5)))+pow((pow(max(0,dot(node_5,halfDirection)),_Gloss)*tex2D(_SpecMap,TRANSFORM_TEX(node_721.rg, _SpecMap)).rgb),_Shinesses)),(sqrt(node_63.rgb)+node_640))*(_LightColor0.rgb*attenuation));
/// Final Color:
                return fixed4(finalColor * 1,0);
            }
            ENDCG
        }
    }
    FallBack "Diffuse"
    CustomEditor "ShaderForgeMaterialInspector"
}
