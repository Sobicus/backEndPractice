import request from "supertest";
import {app} from '../app'
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
