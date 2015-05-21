// Shader created with Shader Forge Beta 0.25 
// Shader Forge (c) Joachim Holmer - http://www.acegikmo.com/shaderforge/
// Note: Manually altering this data may prevent you from opening it in Shader Forge
/*SF_DATA;ver:0.25;sub:START;pass:START;ps:flbk:,lico:1,lgpr:1,nrmq:1,limd:0,uamb:True,mssp:True,lmpd:False,lprd:False,enco:False,frtr:True,vitr:True,dbil:False,rmgx:True,hqsc:True,hqlp:False,blpr:0,bsrc:0,bdst:0,culm:0,dpts:2,wrdp:True,ufog:True,aust:True,igpj:False,qofs:0,qpre:1,rntp:1,fgom:False,fgoc:False,fgod:False,fgor:False,fgmd:0,fgcr:0.5,fgcg:0.5,fgcb:0.5,fgca:1,fgde:0.01,fgrn:0,fgrf:300,ofsf:0,ofsu:0;n:type:ShaderForge.SFN_Final,id:1,x:32228,y:32480|normal-442-OUT,custl-4-OUT;n:type:ShaderForge.SFN_LightAttenuation,id:2,x:33141,y:33219;n:type:ShaderForge.SFN_LightColor,id:3,x:33141,y:33067;n:type:ShaderForge.SFN_Multiply,id:4,x:32479,y:32687|A-465-OUT,B-122-OUT;n:type:ShaderForge.SFN_NormalVector,id:5,x:33658,y:32399,pt:True;n:type:ShaderForge.SFN_LightVector,id:6,x:33658,y:32278;n:type:ShaderForge.SFN_Dot,id:7,x:33469,y:32316,dt:1|A-6-OUT,B-5-OUT;n:type:ShaderForge.SFN_Multiply,id:9,x:33176,y:32352|A-63-RGB,B-7-OUT;n:type:ShaderForge.SFN_Tex2d,id:17,x:32526,y:32007,ptlb:BumpMap,tex:b5b492e53874e4c4da36179ce0e440de,ntxv:3,isnm:True;n:type:ShaderForge.SFN_Tex2d,id:63,x:33703,y:31964,ptlb:MainTex,tex:78fb70c64a6aa194380cdb4b0b2043ec,ntxv:0,isnm:False;n:type:ShaderForge.SFN_Multiply,id:122,x:32856,y:33136|A-3-RGB,B-2-OUT;n:type:ShaderForge.SFN_Sin,id:368,x:32702,y:32254|IN-17-RGB;n:type:ShaderForge.SFN_Tan,id:442,x:32500,y:32374|IN-368-OUT;n:type:ShaderForge.SFN_Multiply,id:452,x:33384,y:32023|A-63-R,B-63-G,C-63-B;n:type:ShaderForge.SFN_Lerp,id:465,x:32813,y:32421|A-452-OUT,B-9-OUT,T-558-OUT;n:type:ShaderForge.SFN_Sqrt,id:549,x:33341,y:31855|IN-63-RGB;n:type:ShaderForge.SFN_Add,id:558,x:33142,y:31838|A-549-OUT,B-452-OUT;proporder:63-17;pass:END;sub:END;*/

Shader "FPS Game/Diffuse Bump" {
    Properties {
        _MainTex ("MainTex", 2D) = "white" {}
        _BumpMap ("BumpMap", 2D) = "bump" {}
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
            uniform sampler2D _MainTex; uniform float4 _MainTex_ST;
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
/////// Normals:
                float2 node_673 = i.uv0;
                float3 normalLocal = tan(sin(UnpackNormal(tex2D(_BumpMap,TRANSFORM_TEX(node_673.rg, _BumpMap))).rgb));
                float3 normalDirection =  normalize(mul( normalLocal, tangentTransform )); // Perturbed normals
                float3 lightDirection = normalize(_WorldSpaceLightPos0.xyz);
////// Lighting:
                float attenuation = LIGHT_ATTENUATION(i);
                float4 node_63 = tex2D(_MainTex,TRANSFORM_TEX(node_673.rg, _MainTex));
                float node_452 = (node_63.r*node_63.g*node_63.b);
                float3 finalColor = (lerp(float3(node_452,node_452,node_452),(node_63.rgb*max(0,dot(lightDirection,normalDirection))),(sqrt(node_63.rgb)+node_452))*(_LightColor0.rgb*attenuation));
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
            uniform sampler2D _MainTex; uniform float4 _MainTex_ST;
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
/////// Normals:
                float2 node_674 = i.uv0;
                float3 normalLocal = tan(sin(UnpackNormal(tex2D(_BumpMap,TRANSFORM_TEX(node_674.rg, _BumpMap))).rgb));
                float3 normalDirection =  normalize(mul( normalLocal, tangentTransform )); // Perturbed normals
                float3 lightDirection = normalize(lerp(_WorldSpaceLightPos0.xyz, _WorldSpaceLightPos0.xyz - i.posWorld.xyz,_WorldSpaceLightPos0.w));
////// Lighting:
                float attenuation = LIGHT_ATTENUATION(i);
                float4 node_63 = tex2D(_MainTex,TRANSFORM_TEX(node_674.rg, _MainTex));
                float node_452 = (node_63.r*node_63.g*node_63.b);
                float3 finalColor = (lerp(float3(node_452,node_452,node_452),(node_63.rgb*max(0,dot(lightDirection,normalDirection))),(sqrt(node_63.rgb)+node_452))*(_LightColor0.rgb*attenuation));
/// Final Color:
                return fixed4(finalColor * 1,0);
            }
            ENDCG
        }
    }
    FallBack "Diffuse"
    CustomEditor "ShaderForgeMaterialInspector"
}
