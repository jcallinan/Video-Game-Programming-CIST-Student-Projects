﻿using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class carMove : MonoBehaviour {
	
	public float carSpeed;
	public float maxPos = 2.6f;
	
	Vector3 position;
	public uiManager ui;
	
	void Awake(){
		
	}
	
	// Use this for initialization
	void Start () {
		
		position = transform.position;
	}
	
	// Update is called once per frame
	void Update () {
		position.x += Input.GetAxis ("Horizontal") * carSpeed * Time.deltaTime;
		
		position.x = Mathf.Clamp(position.x, -2.6f,2.6f);
		
		transform.position = position;
		
	}
	
	void OnCollisionEnter2D(Collision2D col){
		if (col.gameObject.tag == "EnemyCar") {
			Destroy (gameObject);
			ui.gameOverActivated();
		}
	}

}