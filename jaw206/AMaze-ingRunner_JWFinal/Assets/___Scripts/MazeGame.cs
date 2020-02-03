using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public enum GameMode
{
    idle,
    playing,
    levelEnd,
    gameOver
}
public class MazeGame : MonoBehaviour
{
    static public MazeGame S; // a Singleton

    // Fields set in the Unity Inspector pane
    public GameObject[] mazes; // An array of the mazes
    public Vector3 mazePos; // The place to put the mazes
    public GameObject characterPrefab; // The Player character


    public bool __________________;

    // Dynamically set fields
    public int level; // The current level
    public int levelMax; // The number of levels
    public GameObject maze; // The current maze
    public GameMode mode = GameMode.idle;
    public static bool gameOverToggle;

    Vector3 _SpawnPointPos = new Vector3(-4.25f, 0f, -4.25f);
    GameObject sp = GameObject.Find(SpawnScript.SPAWN_POINT);

    public Canvas victoryHUD;
    

    // Use this for initialization
    public void Start()
    {
        victoryHUD = victoryHUD.GetComponent<Canvas>();

        victoryHUD.enabled = false;
        gameOverToggle = false;

        if (sp == null)
        {
            Debug.LogWarning("Can not find SpawnPoint");

            sp = new GameObject(SpawnScript.SPAWN_POINT);
            Debug.Log("Created SpawnPoint");

            sp.transform.position = _SpawnPointPos;
            Debug.Log("Moved SpawnPoint");
        }

        S = this; // Define the Singleton

        level = 0;
        levelMax = mazes.Length;
        StartLevel();
    }

    void StartLevel()
    {
        // Get rid of the old maze if one exists
        if (maze != null)
        {
            Destroy(maze);
        }

        GameObject[] gos = GameObject.FindGameObjectsWithTag("CharacterPrefab");
        foreach (GameObject pTemp in gos)
        {
            Destroy(pTemp);
        }

        // Instantiate the new maze
        maze = Instantiate(mazes[level]) as GameObject;
        maze.transform.position = mazePos;

        // Reset Character
        Instantiate(characterPrefab, sp.transform.position, Quaternion.identity);

        // Reset Goal
        Goal.goalMet = false;

        // Add Time to Game
        TimeManager.countingTime += 25f;
        // Keep Victory Score synced to Game Time
        Victory.victoryScoreTime += 25f;




        mode = GameMode.playing;
    }

    // Update is called once per frame
    void Update()
    {
        if (mode == GameMode.playing && Goal.goalMet)
        {
            mode = GameMode.levelEnd;
            Invoke("NextLevel", 2f);
        }



    }

    void NextLevel()
    {
        level++;
        if (level == levelMax)
        {
            ToggleVictory();
        }
        StartLevel();
    }

    public void ToggleVictory()
    {
        victoryHUD.enabled = true;
    }
}
