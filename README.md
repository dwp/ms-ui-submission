# New Style ESA Online UI Node Server

This is the front end Node server and client facing code, (HTML, CSS, JS and [Nunjucks](https://mozilla.github.io/nunjucks/getting-started.html)) to run the ESA Online data submission app.

## Table of Contents

* Documentation
* Application Architecture
* Running the Node Server
* Testing
* Linting
* Continuous Integration (CI) Pipeline
* Production Release
* Service Unavailable Page Generation Process

## Documentation

See [Readme General Info (CI)](https://confluence.service.dwpcloud.uk/pages/viewpage.action?pageId=173911803) for detailed documentation and general info on health platform services.

## Application Architecture

node.js application using the @dwp/govuk-casa internally-created node module used for inputting form data.

Uses css, html, node, and nunjucks.

### Application Files

Follows the standard structure for CASA integration.
 
Overrides the casa journey-form (see views/casa/components/journey-form) so can add 'data-button-action' attribute for Google Analytics

See documentation of @dwp/govuk-casa.

## Running the Node Server

Use the node start script to start the application on local device by either:

[a] pull the code from the git repo, and run `npm install`, and `env $(cat .env.dev | grep -v ^# | xargs) npm start`

OR

[b] using docker, start with `npm run start:docker` - this rebuilds the image from the latest code to pick up changes. Stop containers with `npm run stop:docker`   

OR

[c] using the [localdev](https://gitlab.nonprod.dwpcloud.uk/health-pdu/infrastructure/localdev) project in git, update the `ms-ui-submission` image in `docker-compose.esa-online.yml` and use `docker-compose` to spin up the environment - `docker-compose -f docker-compose.esa-online.yml up -d`. To stop all `localdev` containers run `docker-compose -f docker-compose.esa-online.yml down`.

## Testing

### Unit Test

Uses mocha and chai to run tests in the `test` folder'. Run `npm test`

### Component Test

Smoke, journey and Axe Core tests can be run using Docker via `npm`:

`npm run test:smoke`  
`npm run test:journey`  
`npm run test:axe`  

These scripts will use the `docker-compose.yml` to spin up local versions of Redis, KMS, a stub server, selenium and the ui application as well as the relevant test image.

To specify a specific set of tests to run, update the image in the `smoke_test`, `journey_test` or `axe_test` job in the `docker-compose.yml` as necessary.

## Linting

Uses `eslint` and DWP linting rules. Linting is done as part of the CI pipeline (see below). However, if you want to run the linting prior to commit run `npm run quality:lint` and to auto fix suitable issues run `npm run quality:lintfix`

## Continuous Integration (CI) Pipeline

The submission-ui component makes use of gitlab ci to run its build CI pipeline.

The pipeline build stages and process are documented here --> https://confluence.service.dwpcloud.uk/pages/viewpage.action?pageId=166156669#CI(ContinuousIntegration)-NodeProjects

### Pipeline Fragments

The CI uses the concept of 'pipeline fragments' to build up a pipeline of modular components. These can be configured by 'including' the relevant fragments in the `gitlab-ci/includes.yml`. Pipeline fragments are stored here https://gitlab.nonprod.dwpcloud.uk/wa-transformation/pipeline-fragments and each comes with a `README` detailing the specific instructions on use.  

***The CI pipeline contains a stage to check that up-to-date versions of each fragment are being used - the pipeline will FAIL if the fragments are too outdated.***

***The CI pipeline contains a stage to check that all the required fragments are included - this is to ensure a minimum level of quality is being met - the pipeline will FAIL if the required fragments are not present.***

The `includes.yml` file is referenced in the main `.gitlab-ci.yml` to pull in the relevant CI jobs

```
include:
  - local: "/gitlab-ci/includes.yml"  
```

The relevant stages must also be defined in the main `.gitlab-ci.yml` e.g.

```
stages:
  - update-version
  - code-quality
  - code-test
  - code-analysis
  - tactical-package
  - image-build
  - container-image-test
  - component-test
  - image-push
  - tactical-push-publish
  - update-project-metadata
  - pages
  - create-schedules
```

If necessary, each job can be overriden to allow flexible configuration - see the relevant fragment `README` for details.

### Variables

Some pipeline fragments require specific variables to be set at a project level - these are documented in the relevant `README`.

The following variables have been set at a `health` group level and are inherited into this repo so ***do not*** need to be set again:

`DEV_ACCOUNT_ID`  
`PROD_ACCOUNT_ID`  
`NEXUS_USER`  
`NEXUS_PASSWORD`  
`AWS_DEFAULT_REGION`  
`WRITE_REPOSITORY_TOKEN`  
`GITLAB_API_TOKEN`  

The following variables have been set at a `health/ns-esa/components` group level and are inherited into this repo so ***do not*** need to be set again:

`AWS_ACCESS_KEY_ID`   
`AWS_SECRET_ACCESS_KEY` 

The following variables are set as CI/CD variables on this repo and ***do not*** need to be set again in the `.gitlab-ci.yml`:

`APP_TEST_REGISTRY`  
`APP_TEST_REGISTRY_PASS`  
`APP_TEST_REGISTRY_USER`   
`JOURNEY_TEST_DEPLOY_PASS`  
`JOURNEY_TEST_DEPLOY_USER`  
`JOURNEY_TEST_REPO`   
 

### Additional stages/jobs

Additional stages/jobs can be added to the main `.gitlab-ci.yml` as necessary.

`ms-ui-submission` has the following additional jobs to run an automated smoke test of the docker container:

`smoke-test`  

### Stryker Mutation Testing

The repo allows Stryker to be run for mutation testing - however, with the size of this project it hangs the pipeline whilst trying to delete the temp directory it creates.

Therefore, the stage has been **explicitly skipped** in the `stryker-mutation` job.

If this job needs to be ran at any time this exception can either

- be removed and a manual run started passing in the variable `NODE_STRYKER_RUN_FEATURE=true`
- be updated so the job variable is set to `true`

### Schedules

The CI pipeline has a stage which sets up a schedule to run the `develop` branch every night - the schedule can be found in the `CI/CD/Schedules` section of Gitlab.

## Production Release

To create production artefacts the following process must be followed https://confluence.service.dwpcloud.uk/display/DHWA/SRE

### Creating the error page templates
The nunjucks templates for the two service unavailable pages (planned and unplanned service interruption) are written in the same way as other pages in the app.
They are put in the `./app/views/casa/errors/external` folder.

### Creating the static pages
There is a node script called `errorpages` in the package.json file, which runs the gulpfile held at the top level of the repo. 

This gulpfile finds the required scss files, compiles them, and produces a static .html file for each template in the external folder. Each .html file contains all the necessary css and js code required to render the page independently - i.e. it does not need to refer to any external files.

It puts these .html files into the `./dist` folder.

DevOps have a process within the build pipeline which runs the errorpages script using `npm run errorpages` . It then takes the resulting .html files and puts them into a central repository of external error pages.
