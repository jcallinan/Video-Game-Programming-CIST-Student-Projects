using UnityEngine;
using System.Collections;

public class EnemyHealth : MonoBehaviour {
	public float health;
	public int scoreValue = 10;

	public virtual void TakeDamage (float dmg) {
		health -= dmg;
		
		Debug.Log (health);
		
		if (health <= 0) {
			Die ();
			ScoreBoard.score += scoreValue;
		}
	}
	
	
	public virtual void Die () {
		Debug.Log ("Dead, Not big surprise");
		Destroy (gameObject);
	}
}