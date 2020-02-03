using UnityEngine;
using System.Collections;

public class CameraSwitch : MonoBehaviour {
    public Camera camPlayer;
    public Camera camMaze;
    

	// Use this for initialization
	void Start () {
        //This will toggle the enables state of the two cameras betwwn true and false eash time
        
	
	}
	
	// Update is called once per frame
	void Update () {
        if (Input.GetKeyUp(KeyCode.Return))
        {
            camPlayer.enabled = !camPlayer.enabled;
            camMaze.enabled = !camMaze.enabled;
        }
    }
}
