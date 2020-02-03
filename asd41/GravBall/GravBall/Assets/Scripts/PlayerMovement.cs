using UnityEngine;
using System.Collections;

public class PlayerMovement : MonoBehaviour
{
    public float moveSpeed = 10;
    public float rotateSpeed = 10;
    public Vector3 moveDir;

    void Update()
    {
        moveDir = new Vector3(0f, 0f, Input.GetAxisRaw("Vertical")).normalized;
        transform.Rotate(0f, Input.GetAxis("Horizontal"), 0f);
    }

    void FixedUpdate()
    {
        GetComponent<Rigidbody>().MovePosition(GetComponent<Rigidbody>().position + transform.TransformDirection(moveDir) * moveSpeed * Time.deltaTime);
    }
}
