# Contributing to the Project

## To Get Started:

1. Fork the repo by clicking the fork button at the top right corner of the page. This will create a copy of the repository in your account.

2. Clone the forked repo. Then in your terminal type the 'git clone' command followed by the forked repo.

```sh
Ex: git clone "https://github.com/your-github-username/title-of-repo"
```
3. Once in your IDE of choice, create a new branch named develop.
```sh
Ex: git checkout -b develop
```
4. Afterwards, run the following command:
```sh
yarn && yarn start
```
5. To scaffold a new plugin inside this repo run the following command:
```sh
yarn run create:plugin "my plugin"
```
6. Once you've made your changes; git add, git commit, and git push those changes to your develop branch.

```sh
git add -A
git commit -m"leave a message about the changes you made"
git push origin develop
```

7. Last but not least, create a new pull request so your code can be reviewed.
- At the top of the page of your forked version of the project there is a pull requests tab.
- After clicking on that tab click the green button that says New Pull Request
- From there, make sure that you are comparing your development branch to the master branch of the repo you forked from. It should look something like the following.
```sh
Ex: base repository: owner-of-repo/name-of-repo base:master <- head repository: your-github-username/name-of-repo compare:develop
```
- Once you check to make you there are no merge conflicts (you should be give a green message saying you're all good to go) click the merge button, give a title stating your username and which issue you fixed, then you can add more details in the description box below that.
-Click Submit and you're done!

