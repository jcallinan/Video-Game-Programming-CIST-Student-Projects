using UnityEngine;
using System.Collections;
using System;

public class CoinSystem : MonoBehaviour {
    public GameObject coin;
    public static bool coinCollected;

    // Use this for initialization
    void Start () {

	}


    void OnTriggerEnter (Collider other)
    {
        if (other.gameObject.tag == "CharacterPrefab")
        {
            CoinSystem.coinCollected = true;
        }
    }
	
	// Update is called once per frame
	void Update () {
        coin.transform.Rotate(0f, 0f, 10f);
        if (coinCollected)
        {
            Destroy(coin);
        }
    }

    
}
