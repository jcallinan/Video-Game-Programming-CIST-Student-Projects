using UnityEngine;
using System.Collections;

public class CharacterMove : MonoBehaviour {

	public float moveSpeed;
    public float rotateSpeed;

    public GameObject characterPrefab;

    // Use this for initialization
    void Start () {
    }
	
	// Update is called once per frame
	void FixedUpdate () {
		transform.Translate(0f, 0f, Input.GetAxis("Vertical")* Time.deltaTime);
		transform.Rotate (0f, rotateSpeed*Input.GetAxis ("Horizontal"), 0f);

        if (Goal.goalMet)
        {
            characterPrefab.SetActive(false);
        }
	}
}
