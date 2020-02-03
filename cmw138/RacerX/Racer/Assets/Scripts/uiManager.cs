using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System.Collections.Generic;


public class uiManager : MonoBehaviour {
	public Button[] buttons;
	public Text scoreText;
	public Text recordText;
	bool gameOver;
	bool paused = false;
	int score;
	
	
	void Start () {
		gameOver = false;
		score = 0;
		InvokeRepeating ("scoreUpdate", 1.0f, 0.5f);
	}
	
	
	void Update () {
		scoreText.text = "Score: " + score;
		
	}
	
	void scoreUpdate(){
		if (!gameOver) {
			score += 1;
		}
	}
	public void gameOverActivated(){
		gameOver = true;
		foreach (Button button in buttons) {
			button.gameObject.SetActive(true);
		}
	}
	public void Play(){
		Application.LoadLevel ("fm1");
		
	}
	
	public void Menu(){
		Application.LoadLevel ("menu");
	}
	
	public void Exit(){
		Application.Quit();
	}
	
	public void Pause() {
		
		if (Time.timeScale == 1) {
			Time.timeScale = 0;
		} else if (Time.timeScale == 0) {
			Time.timeScale = 1;	
		}
		if (paused)
			paused = false;
		else
			paused = true;
		if (paused) {
			AudioListener.pause = true;
			Time.timeScale = 0;
		} else {
			AudioListener.pause = false;
			Time.timeScale = 1;
		}
	}
}

