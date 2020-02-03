using UnityEngine;
using System.Collections;

public class MeatGrinderScript : MonoBehaviour {

    public float GridUpperspeed = 50f;

    public float TopLimit = 171.8f;

    // Use this for initialization
    void Start () {
	
	}

    // Update is called once per frame
    void Update()
    {
        //Basic Movement
        Vector3 pos = transform.position;
        pos.y += GridUpperspeed * Time.deltaTime;
        transform.position = pos;
        //Changing Direction
        if (pos.y < -TopLimit)
        {
            GridUpperspeed = Mathf.Abs(GridUpperspeed); // Move down
        }
        else if (pos.y > TopLimit)
        {
            GridUpperspeed = -Mathf.Abs(GridUpperspeed); //Move up
        }
    }
}
