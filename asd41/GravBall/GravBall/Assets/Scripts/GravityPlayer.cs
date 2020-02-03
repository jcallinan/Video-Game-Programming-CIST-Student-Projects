using UnityEngine;
using System.Collections;

public class GravityPlayer : MonoBehaviour
{
    public GravityScript sender;
    private Transform myTransform;

    void Awake()
    {
        sender = Object.FindObjectOfType<GravityScript>();
    }

    void Start()
    {
        GetComponent<Rigidbody>().constraints = RigidbodyConstraints.FreezeRotation;
        GetComponent<Rigidbody>().useGravity = false;
        myTransform = transform;
    }

    void Update()
    {
        sender.Repulse(myTransform);
    }
}
