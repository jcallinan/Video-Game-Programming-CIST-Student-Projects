using UnityEngine;
using System.Collections;

public class ShadowBlob : MonoBehaviour
{

	public GameObject target;
	public Vector3 targetPos;
	public Vector2 targetPos2D;
	public float speed;
	public GameObject shadowBlob;


	// Use this for initialization
	void Start ()
	{
		target = GameObject.FindGameObjectWithTag ("CK");
		Vector3 targetPos = target.transform.position;
		targetPos2D.x = targetPos.x;
		targetPos2D.y = targetPos.y;
		this.GetComponent<Rigidbody2D> ().AddForce (targetPos2D);
	
	}
	
	// Update is called once per frame
	void Update ()
	{
		if (transform.position.x < -1330f) {
			Destroy (this.gameObject);
		}

		if (transform.position.x > 1300f) {
			Destroy (this.gameObject);
		}

		if (transform.position.y > 780f) {
			Destroy (this.gameObject);
	
		}
		
		if (transform.position.y < -750f) {
			Destroy (this.gameObject);
			
		}
	}
}
