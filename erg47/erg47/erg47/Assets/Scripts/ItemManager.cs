using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class ItemManager : MonoBehaviour {

	public UnityEngine.UI.Text itemInfo;
	public UnityEngine.UI.Text itemCount;
	public Click click;
	public float cost;
	public float tickValue = 0.00f;
	public float count = 0.00f;
	public string itemName;
	public Color standard;
	public Color affordable;
	private float baseCost;
	private Slider _slider;
	// Use this for initialization
	void Start () {
		baseCost = cost;
		_slider = GetComponentInChildren<Slider> ();


	}
	
	// Update is called once per frame
	void Update () {
		itemInfo.text = itemName + "\nCost: " + CurrencyConverter.Instance.GetCurrencyIntoString(cost, false, false) + "\nGold: " + tickValue + "/s";

	



		_slider.value = click.gold / cost * 100;
		if (_slider.value >= 100 ) {
			GetComponent<Image> ().color = affordable;
		} else {
			GetComponent<Image> ().color = standard;
		}
	}

	public void PurchasedItem() {


		if (click.gold >= cost) {
			click.gold -= cost;
			count++;
			cost = Mathf.Round (baseCost * Mathf.Pow (1.5f, count));

			if (count > 0) {
				count++;
				itemCount.text = " " + count / 2;
			}	
		}


	
	}







}
