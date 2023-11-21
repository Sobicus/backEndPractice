import request from "supertest";
import {app} from '../settings'
/*
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
*/
describe('blogs', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })
    it('should return 200 and empty array', async () => {
        await request(app).get('/blogs').expect(200, {
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        })
    })
    it('should return 404 blog by id,blog does not exist in database', async () => {
        await request(app).get('/blogs/6516f5a5ec6f53ecf360d7a7').expect(404)
    })
    it('should return 404 post by id,post does not exist in database', async () => {
        await request(app).get('/blogs/6516f5a5ec6f53ecf360d7a7/posts').expect(404)
    })
})

// describe('check videos', () => {
//     let createdVideo: any = null
//     beforeAll(async () => {
//         await request(app).delete('/testing/all-data')
//     })
//     it('should return 200 and empty array', async () => {
//         await request(app).get('/videos').expect(200, [])
//     })
//     it('should return 404', async () => {
//         await request(app).get('/videos/0').expect(404)
//     })
//     it('should`t create videos with incorect title data return error message and 400', async () => {
//         await request(app).post('/videos').send({
//             title: "",
//             author: "With out title",
//             availableResolutions: ["P144"]
//         }).expect(400, {errorsMessages: [{message: 'Invalid  title', field: 'title'}]})
//         await request(app).get('/videos').expect(200, [])
//
//     })
//     it('should`t create videos with incorect author data return error message and 400', async () => {
//         await request(app).post('/videos').send({
//             title: "With out author",
//             author: "",
//             availableResolutions: ["P144"]
//         }).expect(400, {errorsMessages: [{message: 'Invalid author ', field: 'author'}]})
//         await request(app).get('/videos').expect(200, [])
//     })
//     it('should`t create videos with incorect availableResolutions data return error message and 400', async () => {
//         await request(app).post('/videos').send({
//             title: "With out availableResolutions",
//             author: "availableResolutions",
//             availableResolutions: []
//         }).expect(400, {
//             errorsMessages: [{
//                 message: 'Invalid availableResolutions',
//                 field: 'availableResolutions'
//             }]
//         })
//         await request(app).get('/videos').expect(200, [])
//     })
//
//     it('should create videos with correct input date', async () => {
//         const createResponse = await request(app).post('/videos').send(
//             {
//                 title: "Test Object",
//                 author: "Test Object",
//                 availableResolutions: ["P144"]
//             }
//         ).expect(201)
//         createdVideo = createResponse.body
//         expect(createdVideo).toEqual({
//             id: expect.any(Number),
//             "canBeDownloaded": false,
//             "minAgeRestriction": null,
//             "createdAt": expect.any(String),
//             "publicationDate": expect.any(String),
//             title: "Test Object",
//             author: "Test Object",
//             availableResolutions: ["P144"]
//         } as VideoType)
//
//         await request(app).get('/videos').expect(200, [createdVideo])
//         await request(app).get('/videos/' + createdVideo.id).expect(200, createdVideo)
//     })
//     it('should`t update videos with incorrect input data', async () => {
//         await request(app)
//             .put('/videos/' + createdVideo.id)
//             .send({
//                 title: "",
//                 author: "Test Object",
//                 availableResolutions: ["P144"]
//             })
//             .expect(400)
//         await request(app).get('/videos/' + createdVideo.id).expect(200, createdVideo)
//     })
//     it('should`t update videos that not exist', async () => {
//         await request(app)
//             .put('/videos/' + 777)
//             .send({
//                 title: "Test Object",
//                 author: "Test Object",
//                 availableResolutions: ["P144"]
//             })
//             .expect(404)
//     })
//     it('should update videos with correct input data', async () => {
//         await request(app)
//             .put('/videos/' + createdVideo.id)
//             .send({
//                 title: "Change And Check",
//                 author: "Change And Check",
//                 availableResolutions: [AvailableResolutions.P2160]
//             })
//             .expect(204)
//
//         const expectedResult = {
//             ...createdVideo,
//             title: "Change And Check",
//             author: "Change And Check",
//             availableResolutions: [AvailableResolutions.P2160]
//         }
//
//         await request(app).get('/videos/' + createdVideo.id).expect(200, expectedResult)
//     })
//     it('should delete video',async ()=>{
//         await request(app).delete('/videos/'+ createdVideo.id).expect(204)
//         await request(app).delete('/videos/'+ createdVideo.id).expect(404)
//         await request(app).get('/videos/' + createdVideo.id).expect(404)
//         await request(app).get('/videos').expect(200, [])
//     })
// })


