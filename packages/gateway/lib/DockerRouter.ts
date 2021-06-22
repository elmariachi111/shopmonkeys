import express from 'express'
import Docker from 'dockerode'
import { Logger } from 'winston'

const createPassword = () => {
  return 'password'
}

const init = ({ logger }: { logger: Logger }) => {
  const router = express.Router()
  const docker = new Docker({})

  const postgresInstances = []

  //list all containers
  router.get('/', async (req, res) => {
    const containers = await docker.listContainers({})
    logger.info(containers)
    res.json(containers)
  })

  router.post('/', async (req, res) => {
    const container = await docker.createContainer({
      Image: 'postgres',
      Labels: {
        'used-for': 'shopmonkeys',
      },
      name: 'some-postgres',
      HostConfig: {
        PortBindings: {
          '5432/tcp': [
            {
              HostPort: '5433',
            },
          ],
        },
      },
      Env: [`POSTGRES_PASSWORD=${createPassword()}`, `POSTGRES_USER=monkey1`],
    })

    await container.start({})
    const result = await container.inspect()
    res.json(result)
  })

  router.delete('/:containerId', async (req, res) => {
    const container = docker.getContainer(req.params.containerId)
    await container.stop()
    const result = await container.remove()
    res.json(result)
  })
  return router
}

export { init }
