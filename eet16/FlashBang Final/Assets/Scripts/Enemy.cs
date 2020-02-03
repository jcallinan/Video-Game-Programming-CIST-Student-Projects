using UnityEngine;
using System.Collections;

[RequireComponent (typeof (NavMeshAgent))]
public class Enemy : MonoBehaviour {
	NavMeshAgent pathfinder;
	Transform target;

	// Use this for initialization
	void Start () {
		pathfinder = GetComponent<NavMeshAgent> ();
		target = GameObject.FindGameObjectWithTag ("Player").transform;
	}
	
	// Update is called once per frame
	void Update () {
		pathfinder.SetDestination (target.position);
	}
}
