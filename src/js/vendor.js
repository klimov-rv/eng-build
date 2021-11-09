import "core-js/stable";
import "regenerator-runtime/runtime";
import svg4everybody from "svg4everybody";
import $ from "jquery";
import objectFitImages from "object-fit-images";



// import asyncBatch from "async-batch";

// async function squares() {
//     const input = [10, 2, 3, 8, 1, 7, 4];
//     const processingOrder = [];

//     const result = await asyncBatch(
//         input,
//         (task, taskIndex, workerIndex) => new Promise(
//             (resolve) => setTimeout(
//                 () => processingOrder.push(task) && resolve(task * task),
//                 task * 25,
//             ),
//         ),
//         2,
//     );

//     console.log(processingOrder); // [  2,  3, 10,  1,  8,  4,  7];
//     console.log(result); // [100,  4,  9, 64,  1, 49, 16];

//     return result;
// }

// squares();



// import videojs from "@videojs";
// let video = videojs('my-video', {
//     autoplay: true,
//   });


svg4everybody();
objectFitImages();
// objectFitVideos();

window.$ = $;
window.jQuery = $;
window.objectFitImages = objectFitImages;
// window.objectFitVideos = objectFitVideos;

require('ninelines-ua-parser');