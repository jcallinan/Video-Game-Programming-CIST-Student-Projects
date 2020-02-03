using UnityEngine;
using System.Collections;

public class PlayerHealth : MonoBehaviour {
	public float health;
	public GUISkin gameOverScreen;
	void Start() {
			Time.timeScale = 1;
	}
	void Update () {
		if (health <= 0) {
			AudioListener.pause = true;
			Time.timeScale = 0;
		}
	}
	public virtual void TakeDamage (int dmg) {
		health -= dmg;
		
		Debug.Log (health);

		}
	void OnCollisionEnter(Collision collisionInfo)
	{
		if(collisionInfo.collider.tag == "Enemy")
		{
			TakeDamage (1);
			print("Player hurt");
			if (health <= 0) {
				AudioListener.pause = true;
				Time.timeScale = 0;
			}
		}
	}
	
	
//	public virtual void Die () {
//		Debug.Log ("Dead, Not big surprise");
//		Destroy (gameObject);
//	}
	private void OnGUI() {
		GUI.skin = gameOverScreen;

		if (health <= 0) {
			GUI.Box (new Rect(Screen.width/4, Screen.height/4, Screen.width/2, Screen.height/2), "Game Over");
			
			if(GUI.Button(new Rect(Screen.width/4+10,Screen.height/4+Screen.height/10+10,Screen.width/2-20,Screen.height/10), "Restart")){
				Application.LoadLevel(Application.loadedLevel);
			}

			if(GUI.Button(new Rect(Screen.width/4+10,Screen.height/4+2*Screen.height/10+10,Screen.width/2-20,Screen.height/10), "Quit")){
				System.Diagnostics.Process.GetCurrentProcess().Kill();
			}
		}
	}
}