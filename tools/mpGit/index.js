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
  console.log('正在获取所有项目')
  await getProjects()
  const dirStr = '/Users/gauchwork'
  console.log(`已获取到${allProjects.length}个项目`)
  allProjects.map((obj, idx) => {
    const p = `${dirStr}/mpGitRepos/${obj.path_with_namespace}`
    console.log(`准备将${obj.ssh_url_to_repo}clone到${p}`)
    let hasP = false
    try {
      const stat = fs.statSync(p);
      hasP = stat.isDirectory()
    } catch (e) {
      //
    }
    let res
    if (hasP) {
      console.log(`${p}已存在在本地`)
      try {
        execSync('git pull', {
          cwd: p
        })
      } catch (e) {
        console.error('执行pull失败')
        console.log(e)
      }
    } else {
      res = execSync(`git clone ${obj.ssh_url_to_repo} ${p}`)
      console.log('clone成功')
    }
    console.log('clone response：', res)
    console.log(`=========== 当前进度：${idx + 1} / ${allProjects.length} ==============`)
  })
}
main()
