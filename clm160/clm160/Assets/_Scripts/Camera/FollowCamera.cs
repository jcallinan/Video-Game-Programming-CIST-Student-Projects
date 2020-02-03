using UnityEngine;
using System.Collections;

public class FollowCamera : MonoBehaviour
{

	static public FollowCamera S;
	public GameObject poi;
	private Transform _t;
	public float minX;
	public float maxX;
	public float minY;
	public float maxY;

	public float cameraX;
	public float cameraY;

	void Awake ()
	{
		S = this;

	}

	// Use this for initialization
	void Start ()
	{
		_t = poi.transform;
	
	}
	
	// Update is called once per frame
	void Update ()
	{
		//Try a case switch

		/*if (_t.position.x > (Screen.currentResolution.width / 2) && _t.position.x < maxX - (Screen.currentResolution.width)) {
			cameraX = _t.position.x;
		} else if (_t.position.x < (Screen.currentResolution.width / 2)) {
			cameraX = Screen.currentResolution.width / 2;
		} else if (_t.position.x > maxX - (Screen.currentResolution.width / 2)) {
			cameraX = maxX - (Screen.currentResolution.width/2);
		}*/

		if (_t.position.x > minX && _t.position.x < maxX) {
			cameraX = _t.position.x;
		} else if (_t.position.x < minX) {
			cameraX = minX;
		} else if (_t.position.x > maxX) {
			cameraX = maxX;
		}

		if (_t.position.y > minY && _t.position.y < maxY) {
			cameraY = _t.position.y;
		} else if (_t.position.y < minY) {
			cameraY = minY;
		}else if (_t.position.y > maxY) {
			cameraY = maxY;
		}


		transform.position = new Vector3 (cameraX, cameraY, transform.position.z);

		/*if (_t.position.x > minX && _t.position.x < maxX) {
			transform.position = new Vector3 (_t.position.x, _t.position.y, transform.position.z);
		} else if (_t.position.x < minX) {
			
			transform.position = new Vector3 (minX, _t.position.y, transform.position.z);
		} else if (_t.position.x > maxX) {
			
			transform.position = new Vector3 (maxX, _t.position.y, transform.position.z);
		}*/

	}

	//Min X is -40




	

}
