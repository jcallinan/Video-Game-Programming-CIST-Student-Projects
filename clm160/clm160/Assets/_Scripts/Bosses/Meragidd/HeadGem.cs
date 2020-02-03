using UnityEngine;
using System.Collections;

public class HeadGem : MonoBehaviour {
	
	public int health;
	public GameObject shadowBlob;

	public bool isActive;

	public GameObject Meragidd;
	
	public float timer;
	public float waitTime;

	// Use this for initialization
	void Start () {
		timer = 0;

		isActive = true;
	
	}
	
	// Update is called once per frame
	void Update () {
		if (health > 0) {
			timer += Time.deltaTime;
			Debug.Log (timer);
		
		
			if (timer > 3.0f) {


				StartCoroutine (CreateBlob (waitTime));
				StartCoroutine (CreateBlob (2 * waitTime));
				StartCoroutine (CreateBlob (3 * waitTime));

			

				timer = 0;
			}
		} else if (health == 0 && isActive) {
			//timer=0;



			Meragidd.AddComponent<Rigidbody2D>();
			Meragidd.GetComponent<Rigidbody2D>().constraints = RigidbodyConstraints2D.FreezePositionY;			
			Meragidd.GetComponent<Rigidbody2D>().constraints = RigidbodyConstraints2D.FreezeRotation;
			Meragidd.GetComponent<Rigidbody2D>().gravityScale=200f;

			isActive = false;
		}
	
	}

	IEnumerator CreateBlob(float waitTime){
		yield return new WaitForSeconds (waitTime);
		GameObject blob = Instantiate(shadowBlob) as GameObject;
		blob.transform.position = transform.position;

	}

	void OnTriggerEnter2D (Collider2D ckfoot)	{
		//Find out what hit this basket
		GameObject collidedWith = ckfoot.gameObject;
		/*if (collidedWith.tag == "Trasure") {*/
		if (collidedWith.tag.Equals ("CK")) {

			health--;
		}
	}
}
