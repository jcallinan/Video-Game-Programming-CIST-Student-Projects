using UnityEngine;
using System.Collections;

public class enemyDestroyer : MonoBehaviour {
	
	
	
	void OnCollisionEnter2D (Collision2D col){
		if (col.gameObject.tag == "EnemyCar"){		
			Destroy (col.gameObject);		}
	}		}