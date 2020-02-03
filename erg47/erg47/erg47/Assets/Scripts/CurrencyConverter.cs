using UnityEngine;
using System.Collections;

public class CurrencyConverter : MonoBehaviour {


	private static CurrencyConverter instance;
	public static CurrencyConverter Instance {
		get { 
			return instance;
		}
	}

	void Awake(){
		CreateInstance();
	}

	void CreateInstance(){
		if (instance == null) {
			instance = this;
		}
	}

	public string GetCurrencyIntoString(float valuetoConvert, bool currencyPersec, bool currencyPerClick){
		string converted;
		if(valuetoConvert >= 1000000){
			converted = (valuetoConvert / 1000000f).ToString("f2") + "Mil";
		} else if(valuetoConvert >= 1000){
			converted = (valuetoConvert / 1000f).ToString("f2") + " K";
			} else {
			converted = "" + valuetoConvert;
		}
		if(currencyPersec == true) {
			converted = converted + " gps";
		}
		if (currencyPerClick == true) {
			converted = converted + " gpc";
		}
		return converted;

	}


}
