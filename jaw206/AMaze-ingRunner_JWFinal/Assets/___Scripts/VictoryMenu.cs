using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class VictoryMenu : MonoBehaviour
{
    public Button btnMainMenu;
    public Button startText;
    public Button exitText;


    void Start()
    {
        btnMainMenu = btnMainMenu.GetComponent<Button>();
        startText = startText.GetComponent<Button>();
        exitText = exitText.GetComponent<Button>();
    }

    public void ExitPress()
    {
        Application.LoadLevel(0);
    }

    public void StartLevel()
    {
        Application.LoadLevel(1);
    }

    public void ExitGame()
    {
        Application.Quit();
    }
}
