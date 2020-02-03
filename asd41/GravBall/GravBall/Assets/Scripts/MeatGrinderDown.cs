using UnityEngine;
using System.Collections;

public class MeatGrinderDown : MonoBehaviour
{

    public float Bottomspeed = 50f;

    public float BottomLimit = 171.8f;

    // Use this for initialization
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        //Basic Movement
        Vector3 pos = transform.position;
        pos.y -= Bottomspeed * Time.deltaTime;
        transform.position = pos;
        //Changing Direction
        if (pos.y > BottomLimit)
        {
            Bottomspeed = Mathf.Abs(Bottomspeed); // Move down
        }
        else if (pos.y < -BottomLimit)
        {
            Bottomspeed = -Mathf.Abs(Bottomspeed); //Move up
        }
    }
}
