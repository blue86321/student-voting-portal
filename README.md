# student-voting-portal

## Develop Guidelines
- Branch name / commit message can follow [commitizen](https://github.com/commitizen/cz-cli) format. ([summary](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13))
### Branch
- Clone to your computer
  ```sh
  git clone https://github.com/blue86321/student-voting-portal.git
  ```
- Checkout to another branch
  ```sh
  git checkout -b NEW_BRANCH_NAME
  ```
- Start developing
  - Multiple small commits are preferred
- Push to the repo
  - Make sure you are sync with the latest code
    ```sh
    git checkout master
    git pull origin master
    git checkout NEW_BRANCH_NAME
    git rebase master
    ```
  - Push
    ```sh  
    git push origin NEW_BRANCH_NAME
    ```
- Create a new `Pull Request` on GitHub GUI

Note: Since this is a small project, we just push to `origin` with different branches. No need to fork.