#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import prompts from 'prompts'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const cwd = process.cwd()
const response = await prompts([
    {
        type: 'text',
        name: 'projectName',
        message: '请输入项目名称',
        initial: 'my-components-library'
    }, {
        type: "toggle",
        name: 'projectOptions',
        message: '是否生成.d.ts文件？',
        initial: false,
    }
])
const targetDir = path.join(cwd, response.projectName)
const templateDir = path.join(__dirname, 'template')


function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true })
    for (const file of fs.readdirSync(src)) {
        const srcPath = path.join(src, file)
        const destPath = path.join(dest, file)
        if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath)
        } else {
            let content = fs.readFileSync(srcPath, 'utf-8')
            content = content.replace(/\-projectname\-/g, response.projectName)
                .replace(/__declaration__/g, response.projectOptions)
            fs.writeFileSync(destPath, content)
        }
    }
}


if (fs.existsSync(targetDir)) {
    console.log(`❌ 文件夹 "${response.projectName}" 已存在，请换个名字`)
    process.exit(1)
}

console.log(`📁 正在创建项目: ${response.projectName}`)
copyDir(templateDir, targetDir)

console.log(`🎉 项目已创建完毕！`)
console.log(`   cd ${response.projectName}`)