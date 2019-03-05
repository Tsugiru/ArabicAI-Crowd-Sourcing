var db = firebase.firestore();
var task_id;

document.querySelector("#task_form").addEventListener("submit", (e) => {
    e.preventDefault();
    var batch = db.batch();

    for (var i = 1; i <= 9; i++) {
        var q = document.getElementById("Q" + i).value;
        var a = document.getElementById("A" + i).value;
        var parag = Math.floor(((i - 1) / 3) + 1);
        var collec = "p" + parag + "_qa";
        var collec_ref = db.collection("tasks").doc(task_id).collection(collec).doc();
        batch.set(collec_ref, { questions: q, answer: a });
    }

    batch.commit().then(() => {
        db.collection("tasks").doc(task_id).update({
            done: true
        }).then(() => {
            window.location.href = "./thanks.html";
        })
        .catch(error => {
            console.log("Error storing documents: ", error);
        });
    })
    .catch(error => {
        console.log("Error storing documents: ", error);
    });
});

db.collection("tasks")
    .where("done", "==", false)
    .get()
    .then(function (query_snapshot) {
        var rand_task = query_snapshot.docs[Math.floor(Math.random() * query_snapshot.docs.length)];
        task_id = rand_task.id;
        document.getElementById("parag1").innerHTML = rand_task.data().p1;
        document.getElementById("parag2").innerHTML = rand_task.data().p2;
        document.getElementById("parag3").innerHTML = rand_task.data().p3;
    })
    .catch(function (error) {
        console.log("Error getting documents: ", error);
    });
