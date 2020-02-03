using UnityEngine;
using System.Collections;

[RequireComponent (typeof (AudioSource))]
public class Gun : MonoBehaviour {
	public Transform spawn;
	private float secondsBetweenShots;
	private float nextPossibleShot;
	private LineRenderer tracer;
	public LayerMask collisionMask;
	public float damage = 1;


	// Use this for initialization
	void Start () {
		if (GetComponent<LineRenderer> ()) {
			tracer = GetComponent<LineRenderer> ();
		}
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	public void Shoot() {
		Ray ray = new Ray (spawn.position, spawn.forward);
		RaycastHit hit;

		float shotDistance = 20;

		if (Physics.Raycast(ray,out hit,shotDistance, collisionMask)) {
			shotDistance = hit.distance;

			if (hit.collider.GetComponent<EnemyHealth>()) {
				hit.collider.GetComponent<EnemyHealth>().TakeDamage(damage);
			}
		}

		Debug.DrawRay (ray.origin, ray.direction * shotDistance, Color.red, 1);
		nextPossibleShot = Time.time + secondsBetweenShots;

		GetComponent <AudioSource>().Play();

		if (tracer) {
			StartCoroutine("RenderTracer", ray.direction * shotDistance);
		}

	}


	private bool CanShoot() {
		bool canShoot = true;

		if(Time.time < nextPossibleShot) {
			canShoot = false;
		}
		return canShoot;

}
	IEnumerator RenderTracer(Vector3 hitPoint) {
		tracer.enabled = true;
		tracer.SetPosition(0,spawn.position);
		tracer.SetPosition(1,spawn.position + hitPoint);
		yield return null;
		tracer.enabled = false;
	}

}
