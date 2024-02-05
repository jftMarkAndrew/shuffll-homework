# for <a href="https://shuffll.com/">Shuffll: AI-driven Video Production Platform</a>

__Objective:__ Develop a single-page video editing interface using Angular and to implement interactive features without any server-side dependencies. The main idea is to be able to chose, arrange and trim different video scenes (each is a single video file) on a track. The result as a virtual representation of a full video assembled from different scenes.

__<a href="https://stackblitz.com/~/github.com/jftMarkAndrew/video-editor">Check the Implementation on StackBlitz ⚡</a>__

![alt text](https://github.com/jftMarkAndrew/video-editor/blob/master/Shuffll.png?raw=true)

# Description

__Requirements__
* The user will see a list of possible scenes.
* The user will be able to preview each of the scenes.
* The user will be able to drag-drop scenes to the timeline.
* The user will be able to use the same scene several times. 

__Assumptions__
* The user won’t need any “space” between the scenes on the track. 
* The user won’t need to put one scenes on top of another scene. Meaning there are no real layers, only a single track.

__The Track__
* There will be a ruler on top of the track, with marker on every round second (1s, 2s,...).
* The user can re-arrange the scenes on the track.
* Each scene’s length on the track (Its width) will be proportional to the ruler.
* You will be able to zoom in and out (Changing the spread of the ruler itself- zoom on the X-axis only).
* You will be able to press ‘play’ and play the track from beginning, one scene after the other.
* When playing, change the ‘Play’ button to ‘Pause’, clicking the ‘Pause’ button will stop the preview.

__Additional Features__
* Create a cursor, when you click on the track, the cursor will move to the location of the click (X-axis only).
* Play the video from where the cursor is.
* When you play the video, move the cursor to the current time playing - update it’s position.
* If the you click to move the cursor while playing the video, update its location as well as immediately jump and continue to play from that point.

# A message from the developer

* __Mark Andrew (Tel Aviv, Israel). You can contact me on <a href="https://www.linkedin.com/in/mark-andrew-jft/">LinkedIn</a> or <a href="https://www.behance.net/mark-andrew-jft">Behance</a>.__
* __Have a great day!__
