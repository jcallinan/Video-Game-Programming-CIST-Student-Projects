using UnityEngine;
using System.Collections;

public class MouseHover : MonoBehaviour {
	void Start () {
		GetComponent<Renderer>().material.color = Color.black;

}
	void OnMouseEnter() {
		GetComponent<Renderer>().material.color = Color.red;
	}
	void OnMouseExit() {
		GetComponent<Renderer>().material.color = Color.black;
	}

}