using UnityEngine;
using System.Collections;

public class Click : MonoBehaviour {

	public UnityEngine.UI.Text gpc;
	public UnityEngine.UI.Text goldDisplay;
	public float gold = 0;
	public float goldperclick = 1;

	void Update () {
		goldDisplay.text = "Gold: " + CurrencyConverter.Instance.GetCurrencyIntoString(gold, false, false);
		gpc.text = CurrencyConverter.Instance.GetCurrencyIntoString(goldperclick, false, true);
	}
	public void Clicked() {
		gold += goldperclick;

	}




	// Use this for initialization
	void Start () {
	
	}


}
