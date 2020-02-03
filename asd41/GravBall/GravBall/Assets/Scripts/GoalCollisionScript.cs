using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class GoalCollisionScript : MonoBehaviour
{
    public const string PLAYER_SPAWN_POINT = "SpawnPoint";//Denotes the SpawnPoint GameObject;
    public GameObject playerAvatar;
    private Vector3 playerAvatarSpawnPOS;
    private int count;
    private int life;
    public Text goalCount;
    public Text lifeCount;
    public Text victoryCondition;


    // Use this for initialization
    void Start()
    {
        playerAvatarSpawnPOS = new Vector3(1, 70, -4);
        count = 0;
        life = 3;
        setgoalCount();
    }

    // Update is called once per frame
    void Update()
    {
        if (life == 0)
        {
            Application.LoadLevel("_Scene_0");
        }

    }

    void OnCollisionEnter(Collision coll)
    {
        // Find out what hit the sphere
        GameObject Go = GameObject.Find(PLAYER_SPAWN_POINT);
        GameObject collidedWith = coll.gameObject;
        if (collidedWith.tag == "GoalObject")
        {
            Destroy(collidedWith);
            Go.transform.position = this.transform.position;
            count = count + 1;
            setgoalCount();
        }
        else if(collidedWith.tag == "DestroyerObstacle")
        {
            //Destroy(this.gameObject);
            this.transform.position = Go.transform.position;
            life = life - 1;
            setgoalCount();
        }
    }

    void setgoalCount()
    {
        goalCount.text = "Goal Count: " + count.ToString();
        lifeCount.text = "Lives: " + life.ToString();
        if(count == 6)
        {
            victoryCondition.text = "YOU WIN!";
        }
    }
}
