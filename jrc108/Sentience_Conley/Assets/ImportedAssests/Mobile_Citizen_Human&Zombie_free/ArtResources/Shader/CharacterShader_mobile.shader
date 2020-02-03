Shader "3DCitizen/CharacterShader_mobile" {

	Properties {
	  _MainColor("MainColor",Color)=(1.0,1.0,1.0,1.0)
	  _MainTex("MainTex (RGB)", 2D) = "white" {}
	  _SpecularColor("SpecularColor",Color)=(1.0,1.0,1.0,1.0)
	  _Specular("Specular",Range(0,10)) = 10
	  _SelectColor("SelectColor",Color)=(0.0,0.0,0.0,1.0)
	  _SelectPower("SelectPower",float) = 0.5

	 }
	 
  Category{
	 SubShader {
	  Tags { "RenderType" = "Opaque"}
	  
	  LOD 400
	  
	  CGPROGRAM
	  #pragma surface surf WpLambert
  
	  half4 LightingWpLambert (SurfaceOutput s, half3 lightDir, half atten) {
          half NdotL = dot (s.Normal, lightDir);
          half diff = NdotL * 0.5 + 0.5;
          half4 c;
          c.rgb = s.Albedo * _LightColor0.rgb * (diff * atten * 2);
          c.a = s.Alpha;
          return c;
      }

	  
	  sampler2D _MainTex;
	  fixed4 _MainColor;
	  fixed4 _SpecularColor;
	  fixed4 _SelectColor;
	  fixed _SelectPower;
	  fixed _Specular;
	  
	  struct Input {
	   fixed2 uv_MainTex;
	   fixed3 worldRefl;
	   float3 viewDir;
	  };
  
   
	  void surf (Input IN, inout SurfaceOutput o) {
	  
	   //MainTex
	   half4 MainTex = tex2D (_MainTex, IN.uv_MainTex);
	   
	   
	   //rim
	   float3 viewDir =  normalize(IN.viewDir.xyz);
	   half rim = 1.0 - saturate(dot (normalize(IN.viewDir), o.Normal));
	   half specRim = 1.0 - rim; 
	   
	   
	   o.Albedo = (MainTex.rgb * _MainColor.rgb) + ((pow(specRim,_Specular) * 0.15) * _SpecularColor.rgb);
	   o.Emission =(pow(rim,_SelectPower))*_SelectColor.rgb;
	 
	  }
	  
  	ENDCG
  	
 	}//SubShader
 Fallback "Mobile/VertexLit"
 }//Catrogy
}//Shader
