using UnityEngine;
using System.Collections;

public class Music : MonoBehaviour {

	AudioSource fxSound;
	public AudioClip backMusic;

	// Use this for initialization
	void Start () {

		fxSound = GetComponent<AudioSource> ();
		fxSound.Play ();
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
