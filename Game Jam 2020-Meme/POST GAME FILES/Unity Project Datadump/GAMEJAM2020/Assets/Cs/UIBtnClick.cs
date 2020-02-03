using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class UIBtnClick : MonoBehaviour
{
    public string ToLevel;
    void Start()
    {
        Button b = gameObject.GetComponent<Button>();
        if (ToLevel != "QUIT")
        {
            
            b.onClick.AddListener(delegate ()
            {
                SceneManager.LoadScene(ToLevel.Trim());
            });
        }
        else
        {
            b.onClick.AddListener(delegate ()
            {
                Application.Quit();
            });
        }
    }
}
