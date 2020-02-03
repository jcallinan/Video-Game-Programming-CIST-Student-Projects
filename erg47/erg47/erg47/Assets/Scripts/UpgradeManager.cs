using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class UpgradeManager : MonoBehaviour {

	public Click click;
	public UnityEngine.UI.Text itemInfo;
	public UnityEngine.UI.Text itemCount;
	public float cost;
	public float count = 0.00f;
	public int clickPower;
	public string itemName;
	public Color standard;
	public Color affordable;
	private float baseCost;
	private Slider _slider;

	void Update () {
		itemInfo.text = itemName + "\nCost: " + CurrencyConverter.Instance.GetCurrencyIntoString(cost, false, false) + "\nPower: +" + clickPower;
		_slider.value = click.gold / cost * 100;

		if (_slider.value >= 100 ) {
			GetComponent<Image> ().color = affordable;
		} else {
			GetComponent<Image> ().color = standard;
		}
	}

	public void PurchasedUpgrade(){
		if (click.gold >= cost) {
			click.gold -= cost;
			count +=1;
			click.goldperclick += clickPower;
			cost = Mathf.Round (baseCost + Mathf.Pow (20f, count));

			if (count > 0) {
				count++;
				itemCount.text = " " + count / 2;
			}

			}
	}

	// Use this for initialization
	void Start () {
		baseCost = cost;
		_slider = GetComponentInChildren<Slider> ();
	}
	
	// Update is called once per frame

}

