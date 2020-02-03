using UnityEngine;
using System.Collections;

public class PauseMenu : MonoBehaviour
{

    // Use this for initialization
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {

    }

    public void ReturntoMenu()
    {
        Application.LoadLevel("GravBallStart");
    }

    public void Exitmiddlegame()
    {
        Application.Quit();
    }
}
