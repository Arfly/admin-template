<script>
export default {
  props: {
    render: {
      type: Object,
      default: null
    }
  },
  render() {
    return this.render
  }
}
</script>
