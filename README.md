This action deletes cancelled workflow runs, which comes in handy when you use
concurrency groups to limit a workflow to one run at a time, like this:

```yaml
concurrency:
  group: foo
```

Typically, if you were to do this you would get a bunch of red ❌s on your
branch for all runs cancelled by the concurrency group.  In fact, there are two
open issues related to this:

- [GitHub Actions | Listing workflows cancelled by concurrency settings as failed could be misleading](https://github.com/orgs/community/discussions/8336)
- [Cancel a workflow without considering it failed?](https://github.com/orgs/community/discussions/27174)

If you enable this action at the beginning of your workflow:

```yaml
jobs:
  delete-cancelled-runs:
    runs-on: 'ubuntu-latest'
    steps:
    - uses: 'MercuryTechnologies/delete-cancelled-runs@latest'
      with:
        workflow-file: 'main.yml'
```

… then it will delete any recent cancelled builds so that they don't pollute
your commit timeline with uninteresting failures.
