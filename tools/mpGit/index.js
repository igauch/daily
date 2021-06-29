const axios = require("axios");
const { execSync } = require('child_process');
const fs = require('fs');
const { gitToken, gitDomain } = require('../../noGit/const')

const gitApiDomain = `${gitDomain}api/v4/`

axios.defaults.baseURL = gitApiDomain
axios.defaults.headers['PRIVATE-TOKEN'] = gitToken

const allProjects = []

const getProjects = async function(params ={}) {
  const res = await axios.get('/projects', {
    params: {
      order_by: 'id',
      per_page: 10,
      sort: 'asc',
      ...params
    }
  })
  const arr = res.data || []
  allProjects.push(...arr)
  if (arr.length) {
    await getProjects({
      id_after: arr[arr.length - 1].id
    }).catch(console.log)
  }
}

const main = async function() {
  await getProjects()
  const dirStr = 'e:\\codes'
  allProjects.map(obj => {
    const p = `${dirStr}/mpGitRepos/${obj.path_with_namespace}`
    console.log(p, obj.ssh_url_to_repo)
    let hasP = false
    try {
      const stat = fs.statSync(p);
      hasP = stat.isDirectory()
    } catch (e) {
      //
    }
    let res
    if (hasP) {
      try {
        execSync('git pull', {
          cwd: p
        })
      } catch (e) {
        console.log(e)
      }
      console.log(1)
    } else {
      res = execSync(`git clone ${obj.ssh_url_to_repo} ${p}`)
      console.log(2)
    }
    console.log(res)
    console.log('=========================')
  })
}
main()
