using UnityEngine;
using System.Collections;

public class Goal : MonoBehaviour {
    static public bool goalMet = false;
    public GameObject goalPrefab;

    // Use this for initialization
    void Start () {

    }
	void OnTriggerEnter(Collider other) {
		if (other.gameObject.tag == "CharacterPrefab") {
			Goal.goalMet = true;
			Color c = GetComponent<Renderer>().material.color;
            c.a = 0.5f;
		}
	}
	
	// Update is called once per frame
	void Update () {
	
	}

}
