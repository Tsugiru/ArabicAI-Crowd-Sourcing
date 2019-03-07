var db = firebase.firestore();
var task_id;

document.querySelector("#task_form").addEventListener("submit", (e) => {
    e.preventDefault();
    var batch = db.batch();
    var collec_ref = db.collection("responses").doc(task_id);
//    var article = db.collection("tasks").doc(task_id);
//    article.get().then(function(doc) {
//    if (doc.exists) {
//         batch.set(collec_ref,{
//            article: doc.data().article,
//            p1: doc.data().p1,
//            p2: doc.data().p2,
//            p3: doc.data().p3
//            },{ merge: true });
//    } else {
//        // doc.data() will be undefined in this case
//        console.log("No such document!");
//    }
//}).catch(function(error) {
//    console.log("Error getting document:", error);
//});

    var qs  = []
    var as = []
    var test_q = document.getElementById("test_q").innerHTML;
    var test_a = document.getElementById("test_a").value;
    for (var i = 1; i <= 9; i++) {
        var q = document.getElementById("Q" + i).value;
        var a = document.getElementById("A" + i).value;
        qs.push(q)
        as.push(a)
    }
     batch.set(collec_ref, {
        questions: qs,
        answers: as,
        test_q: test_q,
        test_a: test_a
       },{ merge: true });
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
        console.log(rand_task.data().p1)
        document.getElementById("parag2").innerHTML = rand_task.data().p2;
        document.getElementById("parag3").innerHTML = rand_task.data().p3;
        document.getElementById("test_parag").innerHTML = rand_task.data().example_p;
        document.getElementById("example_q").innerHTML = rand_task.data().example_q;
        document.getElementById("example_a").innerHTML = rand_task.data().example_a;
        console.log(rand_task.data().test_q)
        document.getElementById("test_q").innerHTML = rand_task.data().test_q;

    })
    .catch(function (error) {
        console.log("Error getting documents: ", error);
    });
